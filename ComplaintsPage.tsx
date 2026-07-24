import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TranslationKeys } from "@/lib/i18n";

export function ComplaintsPage({ t, lang }: { t: TranslationKeys; lang: "ar" | "en" }) {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    if (!subject || !details) {
      toast.error(lang === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    toast.success(t.complaints.success);
    setSubject("");
    setDetails("");
  };

  return (
    <div className="min-h-full bg-slate-50 px-5 pt-14 dark:bg-slate-900">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.complaints.title}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.complaints.subtitle}</p>

      <Card className="mt-4 rounded-2xl border-0 shadow-md dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">{t.complaints.subject}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t.complaints.subjectPlaceholder}
            className="rounded-xl"
          />
        </CardContent>
      </Card>

      <Card className="mt-4 rounded-2xl border-0 shadow-md dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">{t.complaints.details}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={t.complaints.detailsPlaceholder}
            className="min-h-32 rounded-xl"
          />
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        className="mt-4 w-full rounded-2xl bg-amber-400 py-6 text-base font-bold text-slate-900 hover:bg-amber-500"
      >
        {t.complaints.submit}
      </Button>
    </div>
  );
}