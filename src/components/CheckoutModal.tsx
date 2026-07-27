    const payload = JSON.stringify({
      documentId: 'unique()',
      data: {
        customer_name: user?.name || "عميل",
        customer_phone: user?.phone || "00000000",
        total: Number(cartTotal) || 0,
        items: JSON.stringify(cartItems || []),
        location: location || "الموقع",
        status: "قيد التحضير"
      }
    });

    try {
      const res = await fetch(`${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/collections/${ORDERS_TABLE_ID}/documents`, {
        method: "POST",
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
          'Content-Type': 'application/json'
        },
        body: payload,
      });
