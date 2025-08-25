import React from "react";
import { useTasksStore } from "../state/tasks.store";
import SwiperElement from "../../../widgets/common/ui/SwiperElement";
import { useMediaQuery } from "../../../core/hooks/useMediaQuery";

const TasksCategories = ({
  availableCategories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { fetchTasks } = useTasksStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const categoriesWithAll = true
    ? [
        {
          id: "all",
          key: "all",
          label: "Все",
          class: "category-all",
        },
        ...availableCategories,
      ]
    : availableCategories;
  const handleClick = (e) => {
    setSelectedCategory(e.key === "all" ? null : e.key); // Если выбрано "Все", сбрасываем фильтр (null)
    fetchTasks();
  };
  return (
    <SwiperElement
      onClick={handleClick}
      items={categoriesWithAll}
      selectedItem={selectedCategory}
    />
  );
};

export default TasksCategories;
