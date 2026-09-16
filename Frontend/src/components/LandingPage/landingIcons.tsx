import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Heart,
  Menu,
  Plus,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const landingIcons = {
  arrow: <ArrowRight />,
  heart: <Heart />,
  shield: <ShieldCheck />,
  clock: <Clock3 />,
  route: <Route />,
  users: <Users />,
  admin: <ShieldCheck />,
  spark: <Sparkles />,
  plus: <Plus />,
  check: <Check />,
  menu: <Menu />,
};

export type LandingIcon = ReactNode;