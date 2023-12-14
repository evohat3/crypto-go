import Slider from "./Switch";
import "../App.css";

function Navbar() {
  return (
    <div class="bg-slate-400 text-white border-2 bg-black"  >
      <div class="float-left ">Crypto-Go</div>
      <div class="float-right">
        <div class="float-left">Light</div>
        <Slider />
        <div class="float-right">Dark</div>
      </div>
    </div>
  );
}

export default Navbar;
