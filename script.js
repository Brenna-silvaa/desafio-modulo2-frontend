const filmes = document.querySelector(".movies");
const info = document.querySelector(".movie__info");
const anterior = document.querySelector(".btn-prev");
const proximo = document.querySelector(".btn-next");
let paginas = 0;
let listaFilmes = [];
let paginaMinima = 0;
let paginaMaxima = 15;
const input = document.querySelector(".input");
const  video = document.querySelector(".highlight__video");
const tituloVideo = document.querySelector(".highlight__title");
const notaVideo = document.querySelector(".highlight__rating");
const generos = document.querySelector(".highlight__genres");
const data = document.querySelector(".highlight__launch");
const sinopse = document.querySelector(".highlight__description");
const link = document.querySelector(".highlight__video-link");
const modal = document.querySelector(".modal");
const tituloModal = document.querySelector(".modal__title");
const imagemModal = document.querySelector(".modal__img");
const sinopseModal = document.querySelector(".modal__description");
const modalGeneros = document.querySelector(".modal__genres");
const modalNota = document.querySelector(".modal__average");
const fecharModal = document.querySelector(".modal__close")


fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false").then(resposta => {

    const promiseBody = resposta.json()

    promiseBody.then((body) => {

        listaFilmes = body.results;
        
        atualizarFilmes()
    })
})

function atualizarFilmes(){
    filmes.innerHTML = "";
    for (let i = paginas; i < paginas + 5; i++){
        let cadaFilme = listaFilmes[i];

        
        const info = document.createElement("div")
        info.classList.add("movie__info")

        const filme = document.createElement("div")
        filme.style.backgroundImage = `url(${cadaFilme.poster_path})`
        filme.classList.add("movie")
        
        const titulo = document.createElement("span")
        titulo.textContent = cadaFilme.title;
        titulo.classList.add("movie__title")

        const nota = document.createElement("span")
        nota.textContent = cadaFilme.vote_average
        nota.classList.add("movie__rating")

        const estrela = document.createElement('img')
        estrela.src = '/assets/estrela.svg'
        estrela.style.width = "13px";
        estrela.style.height = "13px";

        nota.append(estrela)
        info.append(titulo, nota)
        filme.append(info)
        filmes.append(filme)                
        
        filme.addEventListener("click", () => {
                abrirModal(cadaFilme.id)
                
        })
    }
}

anterior.addEventListener("click", () => {
    if (paginas == 0){
        paginas = paginaMaxima;
    } else {
        paginas -= 5;
    }
    atualizarFilmes()
})

proximo.addEventListener("click", () =>{
    if (paginas == paginaMaxima){
        paginas = 0
    } else {
        paginas += 5
    }

    atualizarFilmes()
})

function filtrarFilme (filme){
    
fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${filme}`).then(resposta => {

    const promiseBody = resposta.json()

    promiseBody.then((body) => {

        listaFilmes = body.results;
        atualizarFilmes()
        
    })
})
}

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter"){
        if (input.value == ""){
            fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false").then(resposta => {

                const promiseBody = resposta.json()

                promiseBody.then((body) => {

                listaFilmes = body.results;
        
                atualizarFilmes()
                })
            })
                paginas = 0
        } else {
            filtrarFilme(input.value)
        }

        input.value = "";
    }
    
})

fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR").then(resposta => {

    const promiseBody = resposta.json()

    promiseBody.then(body => {
        video.style.background = `linear-gradient( rgba(0, 0, 0, 0.6) 100%,  rgba(0, 0, 0, 0.6) 100%), url(${body.backdrop_path}) no-repeat center / cover `

        tituloVideo.textContent = body.title;
        notaVideo.textContent = body.vote_average;
        generos.textContent = body.genres.map(genero => genero.name).join(", ") + " /";
        data.textContent = body.release_date
        sinopse.textContent = body.overview
    })
})

fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR").then(resposta => {
    const promiseBody = resposta.json()

    promiseBody.then(body => {
        link.href = `https://www.youtube.com/watch?v=${body.results[0].key}`
    })
})

function abrirModal(id){
    modal.style.display = 'flex';

    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`).then(resposta =>{
        const promiseBody = resposta.json()
        
        
        promiseBody.then(body => {
            console.log(body)
            tituloModal.textContent = body.title;
            imagemModal.src = body.backdrop_path;
            sinopseModal.textContent = body.overview;
            modalNota.textContent = body.vote_average;
            modalGeneros.innerHTML = "";
            body.genres.forEach(genero => {
                const genreModal = document.createElement("span")
                genreModal.classList.add("modal__genre")
                genreModal.textContent = genero.name

                console.log(genreModal)
                modalGeneros.append(genreModal);
            })
        })
    })
}


modal.addEventListener("click", () => {
    modal.style.display = "none"
})

fecharModal.addEventListener("click", () => {
    modal.style.display = "none"
})