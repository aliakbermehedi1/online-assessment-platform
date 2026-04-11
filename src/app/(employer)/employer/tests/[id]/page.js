"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExam } from "@/hooks/useExam";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function ViewCandidatesPage() {
  const { id } = useParams();
  const router = useRouter();
  const { exams, fetchExams } = useExam();
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const exam = exams.find((e) => e.id === parseInt(id));

  useEffect(() => {
    fetchExams();
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [subRes, qRes] = await Promise.all([
        fetch(`/api/submissions/results?exam_id=${id}`),
        fetch(`/api/questions?exam_id=${id}`),
      ]);
      const subData = await subRes.json();
      const qData = await qRes.json();
      setSubmissions(subData.submissions || []);
      setQuestions(qData.questions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function calculateScore(submission, questions) {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const negativePerWrong = parseFloat(exam?.negative_marking ?? -0.25);

    for (const q of questions) {
      if (q.question_type === "Text") continue;
      const candidateAnswer = submission.answers?.[q.id];
      const correctOptions =
        q.options?.filter((o) => o.is_correct).map((o) => o.id) || [];

      if (
        !candidateAnswer ||
        (Array.isArray(candidateAnswer) && candidateAnswer.length === 0)
      ) {
        skipped++;
        continue;
      }

      if (q.question_type === "Checkbox") {
        const answerArr = Array.isArray(candidateAnswer)
          ? candidateAnswer
          : [candidateAnswer];
        const isCorrect =
          answerArr.length === correctOptions.length &&
          answerArr.every((a) => correctOptions.includes(a));
        if (isCorrect) correct++;
        else wrong++;
      } else {
        if (correctOptions.includes(candidateAnswer)) correct++;
        else wrong++;
      }
    }

    const mcqCount = questions.filter((q) => q.question_type !== "Text").length;
    const totalScore = questions.reduce((sum, q) => sum + (q.score || 1), 0);
    const earnedScore = correct * 1 + wrong * negativePerWrong;
    const percentage =
      mcqCount > 0 ? Math.round((earnedScore / mcqCount) * 100) : 0;

    return {
      correct,
      wrong,
      skipped,
      earnedScore: Math.max(0, earnedScore).toFixed(2),
      totalScore: mcqCount,
      percentage: Math.max(0, percentage),
    };
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Navbar title="Online Test" role="employer" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {exam?.title || "Exam Results"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {submissions.length} submission
                {submissions.length !== 1 ? "s" : ""} received
              </p>
            </div>
            <button
              onClick={() => router.push("/employer/dashboard")}
              className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#6B3FE7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-[17px] font-bold text-gray-800">
              No Submissions Yet
            </p>
            <p className="text-sm text-gray-400">
              No candidates have submitted this exam.
            </p>
          </div>
        ) : selectedSubmission ? (
          // Detailed view
          <div>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="mb-4 text-sm text-[#6B3FE7] hover:underline flex items-center gap-1"
            >
              ← Back to list
            </button>
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">
                    {selectedSubmission.candidate_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Ref. ID: {selectedSubmission.ref_id}
                  </p>
                </div>
                {(() => {
                  const s = calculateScore(selectedSubmission, questions);
                  return (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#6B3FE7]">
                        {s.earnedScore} / {s.totalScore}
                      </p>
                      <p className="text-sm text-gray-500">
                        {s.percentage}% — {s.correct} correct, {s.wrong} wrong,{" "}
                        {s.skipped} skipped
                      </p>
                    </div>
                  );
                })()}
              </div>
              {selectedSubmission.is_timeout && (
                <span className="inline-block bg-red-50 text-red-600 text-xs px-2 py-1 rounded-lg mb-4">
                  Timeout submission
                </span>
              )}
            </div>

            {questions.map((q, idx) => {
              const candidateAnswer = selectedSubmission.answers?.[q.id];
              const correctOptions =
                q.options?.filter((o) => o.is_correct).map((o) => o.id) || [];
              let status = "skipped";
              if (
                candidateAnswer &&
                !(
                  Array.isArray(candidateAnswer) && candidateAnswer.length === 0
                )
              ) {
                if (q.question_type === "Text") {
                  status = "text";
                } else if (q.question_type === "Checkbox") {
                  const arr = Array.isArray(candidateAnswer)
                    ? candidateAnswer
                    : [candidateAnswer];
                  status =
                    arr.length === correctOptions.length &&
                    arr.every((a) => correctOptions.includes(a))
                      ? "correct"
                      : "wrong";
                } else {
                  status = correctOptions.includes(candidateAnswer)
                    ? "correct"
                    : "wrong";
                }
              }

              const statusConfig = {
                correct: {
                  bg: "bg-green-50 border-green-200",
                  badge: "bg-green-100 text-green-700",
                  label: "+1 pt",
                },
                wrong: {
                  bg: "bg-red-50 border-red-200",
                  badge: "bg-red-100 text-red-700",
                  label: `${exam?.negative_marking ?? "-0.25"} pt`,
                },
                skipped: {
                  bg: "bg-gray-50 border-gray-200",
                  badge: "bg-gray-100 text-gray-600",
                  label: "Skipped",
                },
                text: {
                  bg: "bg-blue-50 border-blue-100",
                  badge: "bg-blue-100 text-blue-700",
                  label: "Text answer",
                },
              }[status];

              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-5 mb-3 ${statusConfig.bg}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-semibold text-gray-800 text-sm flex-1 pr-4">
                      Q{idx + 1}. {q.question_text}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap ${statusConfig.badge}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  {q.question_type === "Text" ? (
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-700 border border-blue-100">
                      {candidateAnswer || (
                        <span className="text-gray-400 italic">
                          No answer provided
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {q.options?.map((opt) => {
                        const isCorrect = opt.is_correct;
                        const isChosen = Array.isArray(candidateAnswer)
                          ? candidateAnswer.includes(opt.id)
                          : candidateAnswer === opt.id;
                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isCorrect ? "bg-green-100 border border-green-300" : isChosen ? "bg-red-100 border border-red-300" : "bg-white border border-gray-100"}`}
                          >
                            <span className="flex-1">{opt.option_text}</span>
                            {isCorrect && (
                              <span className="text-green-600 text-xs font-semibold">
                                ✓ Correct
                              </span>
                            )}
                            {isChosen && !isCorrect && (
                              <span className="text-red-600 text-xs font-semibold">
                                ✗ Chosen
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // List view
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    #
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    Candidate
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    Ref. ID
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    Score
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    Correct
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    Wrong
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    Skipped
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    Submitted At
                  </th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, idx) => {
                  const s = calculateScore(sub, questions);
                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm font-semibold text-gray-800">
                          {sub.candidate_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {sub.candidate_email}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {sub.ref_id}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-bold text-[#6B3FE7]">
                          {s.earnedScore}/{s.totalScore}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({s.percentage}%)
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-semibold text-green-600">
                          {s.correct}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-semibold text-red-500">
                          {s.wrong}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-500">
                          {s.skipped}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {sub.is_timeout ? (
                          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                            Timeout
                          </span>
                        ) : (
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                            Submitted
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400">
                        {new Date(sub.submitted_at).toLocaleString("en-BD", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="text-xs text-[#6B3FE7] hover:underline font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
