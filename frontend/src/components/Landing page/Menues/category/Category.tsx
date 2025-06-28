import { Card } from "antd";
import { Category } from "../../types/order";
import "./category.css";
import { useState } from "react";

function Categories({
  categoryList,
  handleCategory,
}: {
  categoryList: Category[];
  handleCategory: (category: any) => void;
}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: any) => {
    setIsScrolling(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
    e.currentTarget.classList.add("grabbing");
  };

  const handleTouchStart = (e: any) => {
    setIsScrolling(true);
    setStartX(e.touches[0].pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e: any) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: any) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.touches[0].pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = (e: any) => {
    setIsScrolling(false);
    e.currentTarget.classList.remove("grabbing");
  };

  const handleTouchEnd = () => {
    setIsScrolling(false);
  };
  return (
    <div
      className="category-container-inner"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {categoryList &&
        categoryList.map((category: any) => (
          <Card
            style={{ width: 200 }}
            bodyStyle={{ padding: 0 }}
            className="category-card"
            key={category.id}
            onClick={(event) => {event.stopPropagation(); handleCategory(category)}}
          >
            <div className="card-img">
              <img src={category.image} alt="" className="card-img" />
            </div>
            <div className="card-title">
              <h3>{category.name}</h3>
            </div>
          </Card>
        ))}
    </div>
  );
}

export default Categories;
