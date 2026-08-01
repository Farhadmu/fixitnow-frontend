export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  technicianProfile?: TechnicianProfile | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio?: string | null;
  experience: number;
  location?: string | null;
  avgRating: number;
  totalReviews: number;
  user?: { id: string; name: string; email: string; phone?: string | null };
  services?: Service[];
  availability?: Availability[];
  reviews?: Review[];
}

export interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Service {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  categoryId: string;
  category?: Category;
  technicianId: string;
  technician?: TechnicianProfile;
  location?: string | null;
  isActive: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  service?: Service;
  technician?: TechnicianProfile;
  customer?: { id: string; name: string; email: string; phone?: string | null };
  scheduledAt: string;
  address?: string | null;
  status: BookingStatus;
  totalAmount: number;
  payment?: Payment | null;
  review?: Review | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method?: string | null;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: PaymentStatus;
  transactionId: string;
  paidAt?: string | null;
  booking?: Booking;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment?: string | null;
  customer?: { id: string; name: string };
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: { page?: number; limit?: number; total?: number };
  data: T;
}

export interface ApiErrorShape {
  success: false;
  message: string;
  errorDetails?: unknown;
}
