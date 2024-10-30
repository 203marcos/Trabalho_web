document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        console.log("Email:", email);
        console.log("Password:", password);

        fetch(
            "https://1862a6fe-f38f-4275-ae1a-1c6a9e2d79fe-00-3fek7cm9et3hu.picard.replit.dev/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `email=${encodeURIComponent(
                    email
                )}&password=${encodeURIComponent(password)}`,
            }
        )
            .then((response) => {
                console.log("Response status:", response.status);
                return response.text();
            })
            .then((data) => {
                console.log("Response data:", data);
                alert(data); // Mostra a resposta do servidor
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
