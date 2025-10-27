export const FilterUi = ({
  filterDay,
  filterMonth,
  filterYear,
  setFilterDate,
  monthNames,
}) => {
  const handleYearChange = (e) => {
    setFilterDate((prev) => ({ ...prev, filterYear: e.target.value }));
  };

  const handleMonthChange = (e) => {
    setFilterDate((prev) => ({ ...prev, filterMonth: e.target.value }));
  };

  const handleDayChange = (e) => {
    setFilterDate((prev) => ({ ...prev, filterDay: e.target.value }));
  };

  return (
    <div className="flex gap-2 flex-wrap"> {/* Removed 'p-4' */}
      <select
        value={filterYear}
        onChange={handleYearChange}
        className="p-2 border rounded text-black dark:bg-black dark:text-white"
      >
        <option value="">All Years</option>
        {/* Generate years dynamically (e.g., last 5 years) */}
        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>
      <select
        value={filterMonth}
        onChange={handleMonthChange}
        className="p-2 border rounded text-black dark:bg-gray-700 dark:text-white"
      >
        <option value="">All Months</option>
        {monthNames.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Day"
        value={filterDay}
        onChange={handleDayChange}
        className="p-2 border rounded w-20 text-black dark:bg-gray-700 dark:text-white"
        min="1"
        max="31"
      />
    </div>
  );
};
