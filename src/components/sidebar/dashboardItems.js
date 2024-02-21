import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckSquare,
  CreditCard,
  Grid,
  Heart,
  Layout,
  List,
  Map,
  ShoppingCart,
  PieChart,
  Sliders,
  Users,
} from "react-feather";
// eslint-disable-next-line react-hooks/rules-of-hooks
const pagesSection = [
  {
    href: "/dashboard",
    icon: Sliders,
    title: "Dashboards",
    children: [
      {
        href: "/dashboard/diesel",
        title: "Diesel",
      },
    ],
  },
  {
    href: "/invoices",
    icon: CreditCard,
    title: "Invoices",
  },
  {
    href: "/pages",
    icon: Layout,
    title: "Pages",
    children: [
      {
        href: "/pages/profile",
        title: "Profile",
      },
      {
        href: "/pages/settings",
        title: "Settings",
      },
    ],
  },
];

const elementsSection = [
  {
    href: "/documentation/welcome",
    icon: BookOpen,
    title: "Documentation",
  },
  {
    href: "/changelog",
    icon: List,
    title: "Changelog",
    badge: "v4.4.1",
  },
];

const docsSection = [
  {
    href: "/documentation/welcome",
    icon: BookOpen,
    title: "Documentation",
  },
  {
    href: "/changelog",
    icon: List,
    title: "Changelog",
    badge: "v4.4.1",
  },
];

const navItems = [
  {
    title: "",
    pages: pagesSection,
  },
];

export default navItems;
