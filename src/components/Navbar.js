import Slider from "./Switch";
import "../App.css";

function Navbar() {
  return (
    <div class="bg-slate-400 text-white border-2 border-black" >
      <div class="float-left">Crypto-Go</div>
      <div class="float-right">
        <div class="float-left">light</div>
        <Slider />
        <div class="float-right">dark</div>
      </div>
    </div>
  );
}

export default Navbar;
