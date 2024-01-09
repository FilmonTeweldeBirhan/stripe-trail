const payBtn = document.querySelector("#payBtn");

payBtn.addEventListener("click", async () => {
  //   console.log("Alright im clicking the button.");
  try {
    const session = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 5 },
        ],
      }),
    });
    console.log("session");

    const json = await session.json();

    if (!session.ok) Promise.reject(json);

    if (session.ok) {
      const { url } = json;
      window.location = url;
    }
  } catch (err) {
    console.error(err.error);
  }
});
