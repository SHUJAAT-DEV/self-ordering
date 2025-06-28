import React from "react";
import "./../../pages/screen/screen.css";
interface LotteryData {
    slotNum: number;
    imgScr: string;
    gameNum: number;
  }
  
  interface LotterycardProps {
    data: LotteryData;
    onClick?: (data: LotteryData) => void;
  }
export default function Lotterycard2({data}:LotterycardProps) {
  return (
    <div className="card-wrraper">
      <div className="lottery-card">
        <img
          src={data.imgScr}
          alt="lottery img"
          className="card-img"
        />
        <div className="card-footer2">
          <span className="card-bottom-text">Game# {data.gameNum}</span>
          <div className="card-slot2">
            Slot# <br/><span>{data.slotNum}</span>
          </div>
          <span className="card-bottom-text">Good<br/> Luck</span>
        </div>
      </div>
     </div>

  );
}