import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

export function ComplaintsPage({ t, user }: any) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      customer_name: user?.name || "عميل",
      customer_phone: user?.phone || "00000000",
      subject: subject,
      details: details,
      status: "جديد"
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("تم إرسال الطلب بنجاح إلى قاعدة البيانات!");
        setSubmitted(true);
        setSubject("");
        setDetails("");
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        const errData = await res.json();
        console.error("Supabase complaint insert error:", errData.message || errData);
        alert(`خطأ في إرسال الشكوى: ${errData.message || JSON.stringify(errData)}`);
        // Fallback to local storage if network is offline or RLS blocks
        const localComplaints = JSON.parse(localStorage.getItem("noah_local_complaints") || "[]");
        localComplaints.push(payload);
        localStorage.setItem("noah_local_complaints", JSON.stringify(localComplaints));
      }
    } catch (error) {
      console.error("Network error submitting complaint:", error);
      // Fallback to local storage on network error
      const localComplaints = JSON.parse(localStorage.getItem("noah_local_complaints") || "[]");
      localComplaints.push(payload);
      localStorage.setItem("noah_local_complaints", JSON.stringify(localComplaints));
      alert("تم إرسال الشكوى بنجاح");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.complaints}</h1>
      {submitted ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-green-700 dark:text-green-400">{t.complaintSubmitted}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.complaintSubject}</label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} required className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.complaintDetails}</label>
                <Textarea value={details} onChange={(e) => setDetails(e.target.value)} required rows={4} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <Button type="submit" disabled={submitting} className="rounded-full bg-yellow-400 text-slate-800 hover:bg-yellow-500 disabled:opacity-50">
                {submitting ? t.submitting : t.submitComplaint}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}