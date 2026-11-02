
import {
  HomeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  {
    id: "dashboard",
    title: "داشبورد",
    icon: HomeIcon,
    color: "purple",
  },
  {
    id: "planner",
    title: "برنامه‌ریز",
    icon: CalendarDaysIcon,
    color: "orange",
  },
  {
    id: "notes",
    title: "یادداشت‌ها",
    icon: DocumentTextIcon,
    color: "teal",
  },
  {
    id: "focus",
    title: "تمرکز و تایمر",
    icon: ClockIcon,
    color: "pink",
  },
  {
    id: "progress",
    title: "آمار و پیشرفت",
    icon: ChartBarIcon,
    color: "blue",
  },
];

function Sidebar({ activePage, onPageChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
      <div className="sidebar__logo">
  <CalendarDaysIcon />
</div>

        <div className="sidebar__brand-text">
          <h2>روزنگار</h2>
          <span>هر روز، یک قدم به جلو</span>
        </div>
      </div>

      <div className="sidebar__menu">
        <p className="sidebar__label">منوی اصلی</p>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar__item sidebar__item--${item.color} ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <span className="sidebar__icon-wrapper">
                  <Icon className="sidebar__icon" />
                </span>

                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar__footer">
        <span>نسخه ۲.۰</span>
        <p>ساخته‌شده با ❤️</p>
      </div>
    </aside>
  );
}

export default Sidebar;
