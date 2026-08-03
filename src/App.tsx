  const handleOnboardingComplete = async (data: { name: string; phone: string; homeAddress: string }) => {
    const newUser = { name: data.name, phone: data.phone, homeAddress: data.homeAddress };
    setUser(newUser);
    setAddresses([{ id: Date.now(), label: t.home, details: data.homeAddress }]);

    // إرسال وتخزين تفاصيل الزائر/المسجل الجديد فوراً إلى جدول visits
    try {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        'visits', // معرف جدول الزوار
        ID.unique(),
        {
          customer_name: data.name,
          customer_phone: data.phone,
          location: data.homeAddress || "العنوان الأساسي",
        }
      );
    } catch (error) {
      console.error("فشل تسجيل الزائر الجديد في جدول visits:", error);
    }
  };
