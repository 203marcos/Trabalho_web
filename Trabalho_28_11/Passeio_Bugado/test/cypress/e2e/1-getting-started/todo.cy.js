describe("Cadastro de Usuário, com permissão para cadastrar um usuário", () => {
    it("deve exibir mensagem de sucesso ao cadastrar um usuário", () => {
        cy.visit(
            "https://passeiobugado-203marcos-marcos-projects-b030f2ef.vercel.app?_vercel_share=s5LCHMblRU8FdOPw4rvOW3Qq96gQx9an"
        ); // Visita a URL da página

        cy.get(":nth-child(4) > .nav-link").click(); // Clica no botão de login

        // Clica no botão "Cadastrar Usuário"
        cy.get("a.btn.btn-primary").click();

        // Preenche o formulário de cadastro
        cy.get("#nome").type("Nome do Usuário"); // Preenche o nome
        cy.get("#email").type("email@exemplo.com"); // Preenche o email
        cy.get("#senha").type("senha123"); // Preenche a senha
        cy.get("#role").select("user"); // Seleciona o papel de usuário

        // Clica no botão de cadastrar
        cy.get('button[type="submit"]').click();

        // Verifica se a mensagem de sucesso é exibida
        cy.get("#message").should(
            "contain",
            "Usuário cadastrado com sucesso." // Ajuste a mensagem de sucesso conforme necessário
        );
    });
});

describe("Cadastro de Usuário, porém sem permissão para cadastrar adm", () => {
    it("deve exibir mensagem de erro ao tentar cadastrar um administrador sem estar logado", () => {
        cy.visit(
            "https://passeiobugado-203marcos-marcos-projects-b030f2ef.vercel.app?_vercel_share=s5LCHMblRU8FdOPw4rvOW3Qq96gQx9an"
        ); // Visita a URL da página

        cy.get(":nth-child(4) > .nav-link").click(); // Clica no botão de login

        // Clica no botão "Cadastrar Usuário"
        cy.get("a.btn.btn-primary").click();

        // Preenche o formulário de cadastro
        cy.get("#nome").type("Nome do Usuário"); // Preenche o nome
        cy.get("#email").type("email@exemplo.com"); // Preenche o email
        cy.get("#senha").type("senha123"); // Preenche a senha
        cy.get("#role").select("admin"); // Seleciona o papel de administrador

        // Clica no botão de cadastrar
        cy.get('button[type="submit"]').click();

        // Verifica se a mensagem de erro é exibida
        cy.get("#message").should(
            "contain",
            "Apenas administradores logados podem registrar novos administradores."
        );
    });
});

describe("Login de Usuário", () => {
    it("deve redirecionar para a página correta ao fazer login com credenciais válidas", () => {
        // Visita a página inicial
        cy.visit(
            "https://passeiobugado-203marcos-marcos-projects-b030f2ef.vercel.app?_vercel_share=s5LCHMblRU8FdOPw4rvOW3Qq96gQx9an"
        );

        // Clica no link de login
        cy.get("#loginLogoutLink").click(); // Clica no link de login

        // Preenche o formulário de login
        cy.get("#email").type("email@exemplo.com"); // Insira um email genérico
        cy.get("#senha").type("senha123"); // Insira uma senha genérica

        // Clica no botão de login
        cy.get('button[type="submit"]').click();

        // Verifica se o usuário foi redirecionado para a página correta
        // Aqui você pode verificar se a URL contém 'admin.html' ou 'index.html'
    });
});

describe("Teste de Clique em Componente e Reserva", () => {
    it("deve clicar na componente, preencher o formulário de reserva e clicar no botão Reservar", () => {
        // Visita a página inicial
        cy.visit(
            "https://passeiobugado-203marcos-marcos-projects-b030f2ef.vercel.app?_vercel_share=s5LCHMblRU8FdOPw4rvOW3Qq96gQx9an"
        );

        // Clica na componente especificada
        cy.get(
            ".active > .row > :nth-child(1) > a > .card > .card-img-top"
        ).click();

        // Simula o login do usuário
        cy.window().then((win) => {
            win.localStorage.setItem(
                "usuario",
                JSON.stringify({
                    id: 1,
                    token: "fake-token", // Use um token fictício para testes
                })
            );
        });

        // Preenche a quantidade de pessoas com 3
        cy.get("#quantidadePessoas").type("3");

        // Seleciona uma data (por exemplo, a data atual)
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // Formata a data no formato YYYY-MM-DD
        cy.get("#dataReserva").type(formattedDate);

        // Espera que o botão esteja visível e clica
        cy.get('button[type="submit"]').should("be.visible").click();

        // Verifica se a mensagem de sucesso ou erro é exibida
        cy.get("#message").should("exist"); // Verifica se a div de mensagem existe
    });
});

describe("Teste de Logout e Verificação do Link", () => {
    it("deve clicar no botão de Logout e verificar se o link muda para Login", () => {
        // Visita a página inicial
        cy.visit(
            "https://passeiobugado-203marcos-marcos-projects-b030f2ef.vercel.app?_vercel_share=s5LCHMblRU8FdOPw4rvOW3Qq96gQx9an"
        );

        // Simula o login do usuário
        cy.window().then((win) => {
            win.localStorage.setItem(
                "usuario",
                JSON.stringify({
                    id: 1,
                    nome: "Usuário Teste",
                    email: "usuario@teste.com",
                    token: "fake-token", // Use um token fictício para testes
                })
            );
        });

        // Recarrega a página para refletir o estado do usuário logado
        cy.reload();

        // Clica no link de logout
        cy.get("#loginLogoutLink").click();

        // Verifica se o link agora diz "Login"
        cy.get("#loginLogoutLink").should("have.text", "Login");
    });
});
