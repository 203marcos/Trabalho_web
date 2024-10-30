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
                if (response.ok) {
                    console.log(
                        "Login bem-sucedido, redirecionando para index.html"
                    );
                    // Armazena o email do usuário no localStorage
                    localStorage.setItem("userEmail", email);
                    window.location.href = "index.html"; // Redireciona para a página inicial após login bem-sucedido
                } else {
                    return response.text().then((text) => {
                        throw new Error(text);
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Erro ao fazer login: " + error.message);
            });
    });
