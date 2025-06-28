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
export default function Lotterycard({data,onClick}:LotterycardProps) {
  return (
    <div className="card-wrraper">
      <div className="lottery-card" onClick={()=>onClick?.(data)}>
        <div className="card-top">
          <strong className="text-top" > Slot#{data.slotNum} </strong>
        </div>
        <img
          src={data.imgScr}
          alt="lottery img"
          className="card-img"
        />
        <div className="card-footer">
          <div className="text-bottom" >Game#{data.gameNum}</div>
        </div>
      </div>
     </div>

  );
}