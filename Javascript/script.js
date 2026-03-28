document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("appointmentForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            message: document.getElementById("message").value
        };

        try {
            const res = await fetch("http://localhost:3000/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const msg = await res.text();

            // ✅ OUTPUT ON SAME PAGE
            document.getElementById("formMessage").innerText = msg;
            document.getElementById("formMessage").style.color = "green";

            form.reset();

        } catch (error) {
            document.getElementById("formMessage").innerText = "❌ Error sending data";
            document.getElementById("formMessage").style.color = "red";
        }
    });

});