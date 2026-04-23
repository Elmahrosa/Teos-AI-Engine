async function handleLogin(email: string) {
  const payload: any = { email };

  if (email.trim().toLowerCase() === "aams1969@gmail.com") {
    const founderKey = prompt("Enter founder key");

    if (!founderKey) {
      alert("Founder key required");
      return;
    }

    payload.founderKey = founderKey;
  }

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Login failed");
    return;
  }

  window.location.href = "/dashboard";
}