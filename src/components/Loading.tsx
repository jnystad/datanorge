import React, { FC } from "react";
import "./Loading.scss";

const Loading: FC = () => (
  <div className="loading">
    Laster
    <div className="loading-dots">
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);

export default Loading;
