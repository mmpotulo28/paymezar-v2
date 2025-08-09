import { iUser } from "@/types";

export const dummyUser: iUser = {
  id: "user-1",
  supabaseId: "user-1-supabase-id",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@email.com",
  imageUrl: "https://i.pravatar.cc/150?img=5",
  enabledPay: true,
  role: "CUSTOMER",
  publicKey: "0x1234...abcd",
  paymentIdentifier: "jane.doe@paymezar.com",
  businessId: null,
  createdAt: "2025-07-01T09:00:00Z",
  updatedAt: "2025-07-30T10:00:00Z",
};
