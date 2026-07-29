  const fetchOrders = () => {
    databases.listDocuments(
      APPWRITE_DATABASE_ID,
      ORDERS_TABLE_ID,
      [Query.orderDesc('$createdAt')]
    ).then(response => {
      if (response.documents) {
        const appwriteOrders = response.documents.map((o: any) => {
          return {
            id: o.$id,
            $id: o.$id,
            status: o.status || "preparing",
            rawStatus: o.status || "preparing",
            total: o.total,
            customer_name: o.customer_name,
            customer_phone: o.customer_phone,
            date: o.$createdAt ? o.$createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            items: typeof o.items === 'string' ? [{ name: o.items, qty: 1 }] : o.items,
            location: o.location,
            deliveredTimer: o.status === 'delivered' ? (o.deliveredTimer || 300) : null,
          };
        });
        setOrders(appwriteOrders);
      }
    }).catch(error => {
      console.error("Error fetching orders from Appwrite:", error);
    });
  };
