const express = require("express");

const {cadastroPokemon, atualizarApelidoPokemon, listarPokemons, listarPokemonsId, excluirPokemons} = require("./controllers/pokemons")

const { cadastrarUsuario, login } = require("./controllers/usuarios");

const verificarUsuarioLogado = require("./intermediarios/autenticacao");

const rotas = express();

rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", login);

rotas.use(verificarUsuarioLogado); //todas a rotas abaixos seram verificadas

rotas.post("/pokemon", cadastroPokemon);
rotas.put("/pokemon", atualizarApelidoPokemon)
rotas.get("/pokemons/:id", listarPokemonsId)
rotas.get("/pokemon" , listarPokemons)
rotas.delete("/pokemon/:id",excluirPokemons)

module.exports = rotas;