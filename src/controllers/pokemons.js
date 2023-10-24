const pool = require("../conexao");

const cadastroPokemon = async (req, res) => {
    try {
        const { nome, habilidades, apelido, imagem } = req.body;
        const { id } = req.usuario;

        // Verifica se os campos obrigatórios foram fornecidos
        if (!nome || !habilidades || !apelido) {
            return res.status(400).json({ mensagem: 'Nome, habilidades e apelido são obrigatórios.' });
        }

        // Verifica se o nome do Pokémon já está cadastrado para o usuário
        const verificarNome = await pool.query('SELECT * FROM pokemons WHERE nome = $1 AND usuario_id = $2', [nome, id]);
        if (verificarNome.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Pokemon já cadastrado.' });
        }

        // Insere o novo Pokémon no banco de dados e retorna os dados inseridos
        const novoPokemon = await pool.query(
            'INSERT INTO pokemons (usuario_id, nome, habilidades, apelido, imagem) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, nome, habilidades, apelido, imagem]
        );

        return res.status(200).json(novoPokemon.rows);

    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ mensagem: 'Erro interno.' });
    }
};

const atualizarApelidoPokemon = async (req, res) => {
    try {
        const { nome, apelido } = req.body;
        const { id } = req.usuario;

        if (!nome || !apelido) {
            return res.status(400).json({ mensagem: 'Nome e apelido são obrigatórios.' });
        }

        const { rows, rowCount } = await pool.query('SELECT * FROM pokemons WHERE nome = $1 AND usuario_id = $2', [nome, id]);

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: "pokemon não encontrado" });
        }

        // Correção aqui: Adicionei a condição WHERE no final da query para filtrar pelo nome e pelo id do usuário.
        await pool.query(
            "UPDATE pokemons SET apelido = $1 WHERE nome = $2 AND usuario_id = $3",
            [apelido, nome, id]
        );

        return res.status(204).send();
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ mensagem: 'Erro Interno.' });
    }
}

const listarPokemons = async (req, res) => {
    const { id } = req.usuario; // Adicionando filtro por usuário
    const buscarPokemons = await pool.query('SELECT * FROM pokemons WHERE usuario_id = $1', [id]);

    return res.status(200).json(buscarPokemons.rows);
}
const listarPokemonsId = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.usuario; // Obtendo o ID do usuário

    try {
        const { rows, rowCount } = await pool.query("SELECT * FROM pokemons WHERE id = $1 AND usuario_id = $2", [id, userId]);

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: "Pokemon não encontrado" });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};
const excluirPokemons = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.usuario; // Obtendo o ID do usuário

    try {
        const { rows, rowCount } = await pool.query("SELECT * FROM pokemons WHERE id = $1 AND usuario_id = $2", [id, userId]);

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: "Pokemon não encontrado" });
        }

        const deletarPokemon = await pool.query('delete from pokemons where id = $1', [id]);

        return res.json(rows[0]);
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};


module.exports = {
    cadastroPokemon,
    atualizarApelidoPokemon,
    listarPokemons,
    listarPokemonsId,
    excluirPokemons
};


/* const buscaPokemon = await pool.query('select * from pokemons where nome = $1 and usuario_id = $2', [nome, id]);
        console.log(buscaPokemon.rows[0]);
        if (buscaPokemon.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Pokemon não localizado.' });
        }*/