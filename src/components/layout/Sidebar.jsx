
import {
  HomeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { id: "dashboard", title: "داشبورد", icon: HomeIcon },
  { id: "planner", title: "برنامه‌ریز", icon: CalendarDaysIcon },
  { id: "notes", title: "یادداشت‌ها", icon: DocumentTextIcon },
  { id: "focus", title: "تمرکز و تایمر", icon: ClockIcon },
  { id: "progress", title: "آمار و پیشرفت", icon: ChartBarIcon },
];

function Sidebar({ activePage, onPageChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">ر</div>
        <div>
          <h2>روزنگار</h2>
          <span>مدیریت روزانه</span>
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
                className={`sidebar__item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="sidebar__icon" />
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
