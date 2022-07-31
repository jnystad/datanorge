import "./Loading.scss";

const Loading = () => (
  <div className="loading-mask">
    <div className="loading">
      <span className="loading-dots">
        <span />
        <span />
        <span />
        <span />
      </span>
      <p>Laster data. Vennligst vent</p>
    </div>
  </div>
);

export default Loading;
