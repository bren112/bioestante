import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseclient'; 
import './cadastrar.css'; 
import './ebook.css';  
import parse from 'html-react-parser';  
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import urso from './tucano.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [readingMode, setReadingMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      fetchArticles(); 
    }
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('Artigos')
        .select('*');

      if (error) {
        throw error;
      }
      
      setArticles(data);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    const { data, error } = await supabase
      .from('users')
      .select('email, senha, nome, avatar') 
      .eq('email', email)
      .single();

    if (error) {
      setMessage('Erro ao buscar o email: ' + error.message);
    } else if (data) {
      if (data.senha === password) {
        const user = {
          nome: data.nome,
          avatar: data.avatar,
        };

        setUserData(user);
        localStorage.setItem('userData', JSON.stringify(user));
        fetchArticles();
      } else {
        setMessage('Senha incorreta.');
      }
    } else {
      setMessage('Email não encontrado.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
  };

  const openModal = (article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleReadingMode = () => {
    setReadingMode((prevMode) => !prevMode);
  };

  const filteredArticles = articles.filter(article =>
    article.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`login-container ${readingMode ? 'reading-mode' : ''}`}>
      <br />
      {userData ? (
        <div className="container-livros">
          <div className="user_logado">
            <div className="user_info">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Avatar" width="100" height="100" />
              ) : (
                <p>Sem avatar</p>
              )}
              <h2>Bem-Vindo, <br /><span id='user_name'>{userData.nome}!</span></h2>
            </div>

            <div className="centro">
            <Link to={'/noticias'}>
              <button><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
</svg></button>
            </Link>
            <button onClick={toggleReadingMode} className="toggle-reading-mode">
            {readingMode ? 'Desativar' : 'Modo Leitura'}
          </button>
            <button id='sair' onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
            </button>
         
            </div>
          </div>

          <h1 id='titulo-ebook'>E-BOOKS</h1>
          <br />

  

          {/* pesquisa */}
          {/*A função de filtragem utiliza o valor de searchQuery para mostrar apenas os artigos cujo título corresponde à pesquisa. Isso é feito com o método filter aplicado à lista de artigos.*/}
          <div className="centro">
          <input
          id='pesquisar'
            type="text"
            placeholder="Pesquisar pelo título"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"

          />
          </div>
          <br />
          <br />

          {loading ? (
            <div className="loader"></div>
          ) : (
            <div className="articles-container">
              {filteredArticles.map(article => (
                <div className="card" key={article.id}>
                  <img src={article.imagem} alt={article.titulo} className="card-image" /> 
                  {/* <h2 id='title' className="card-title">{'"'+article.titulo+'"'}</h2> */}
                  <p id='' className="card-desc">{article.desc}</p>
                  <br />
                  <div className="botoes">
                    <button className="card-button" onClick={() => openModal(article)}>Ler</button>
                  </div>
                  <br />
                </div>
              ))}
            </div>
          )}

          {selectedArticle && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={closeModal}>×</span>
                <h2>{selectedArticle.titulo}</h2>
                <div className="modal-body">
                  {parse(selectedArticle.content, {
                    replace: (domNode) => {
                      if (domNode.type === 'tag' && domNode.name === 'img') {
                        domNode.attribs.style = 'max-width: 100%; height: auto;';
                      }
                    }
                  })} 
                </div>
              </div>
            </div>
          )}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity="info">
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <br />
        </div>
      ) : (

        <div className="container-logar">
          <div className="esquerda">
            <img src={urso} alt="" srcset="" id="front_urso"/>
          </div>
        <div className='container-form'>
          <h1 id='h1'>Login</h1>
          <p id='p'>Realize o Login p/ poder fazer a Leitura!</p>

          <img src={urso} alt="" srcset="" id="front_urso_mobile"/>

          <br/>
          <div className="form">
            <form onSubmit={handleLogin}>
              <br/>

              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Senha:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <br/>
              <button id='entrar' type="submit">Entrar</button>
              <br/>
              <Link to="/cadastrar">
                <button id="semConta">Não Tenho uma conta!</button>
              </Link>

              <Link to="/esqueci">
                <button id="semConta">Redefinir Senha</button>
              </Link>
              {message && <p className="message">{message}</p>}
            </form>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default Login;
