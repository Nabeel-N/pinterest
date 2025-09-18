"use client";
import Button from "./Component/Button";

export default function App() {
  return (
    <div>
      <Button
        classname="bg-amber-800 rounded-lg p-3 m-8"
        onclick={() => {
          alert("hello clicked");
        }}
      >
        Signup
      </Button>

      <Button
        classname="bg-violet-800 rounded-lg p-3 m-8"
        onclick={() => {
          alert("hello clicked");
        }}
      >
        Signin
      </Button>
    </div>
  );
}
