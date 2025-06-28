import { useState } from "react";
import { useParams } from "react-router-dom";
import Categories from "./category/Category";
import useMenueScreen from "./hooks/useMenuScreen";
import MenuCard from "./MenuCard";
import "./main.css";

const MainMenueScreen = () => {
  const { tableNumber, categoryId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<any>({});
  const { menueCategoryList } = useMenueScreen({
    tableNumber,
    categoryId,
  });

  return (
    <div className="menu-container">
      <div className="category-container">
        <h1>Category</h1>
        <Categories
          categoryList={menueCategoryList}
          handleCategory={(category) => setSelectedCategory(category)}
        />
      </div>
      <div className="menu-card-container">
        <h1>Menus</h1>
        {selectedCategory?.id && <MenuCard data={selectedCategory} />}
      </div>
    </div>
  );
};

export default MainMenueScreen;
