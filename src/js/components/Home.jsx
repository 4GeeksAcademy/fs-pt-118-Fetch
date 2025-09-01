import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState('');
	const [newUser, setNewUser] = useState('')
	const [selectedUserTodos, setSelectedUserTodos] = useState()
	const [newTask, setNewTask] = useState('')
	//fetch
	// para interactuar con una API
	/*
	endpoint --> direccion habilitada para recibir y responder a pedidos HTTP
	metodos
	siempre tener en cuenta el metodo del endpoint
	GET -> traer uno o N registros
	POST -> crear un nuevo registro
	PUT -> modificar un registro
	DELETE -> eliminar un registro

	//cabeceras
	headers: {} --> es un objeto

	headers: {
		'Content-Type': 'application/json', ---> es para que el back sepa como tratar/interpretar/procesar nuestra informacion
	}

	si realizamos un POST o un PUT
	body: JSON.stringify(formData) ---> recibe un objeto

JSON.stringify(obj) ---> convertir a string un objeto JS
	

	solo se necesita el objeto de opciones del fetch cuando NO sea GET 
	GET es el metodo por defecto de un fetch
	
	estructura de un fetch

	fetch(url, {
	method: GET/POST/PUT/DELETE/PATCH
	headers: {
		'Content-Type': 'application/json'
	}
		body: JSON.stringify()
	}
	)

	*/
	//lo usamos para cargar la informacion al cargarse el componente
	useEffect(() => {
		//fetch por promesas
		fetch('https://playground.4geeks.com/todo/users')
			.then(resp => {
				console.log(resp)
				//manejamos errores, siempre se manejan
				if (!resp.ok) {
					//lanzamos un error si el OK es false (significa que hubo un error en el pedido)
					throw new Error(`${resp.status} ${resp.statusText}`)
				}
				return resp.json() //aqui transformamos la respuesta de texto a objeto js
			})
			.then(data => setUsers(data.users))
			.catch(error => console.log('error recibido --//--> ', error))
	}, []) // array de dependencias vacio para que se ejecute onLoad y una vez.


	useEffect(() => {
		//fetch por promesas --> estamos usando el selectedUser para traernos la informacion del usuario que seleccionamos
		if (selectedUser !== '') {
			fetch('https://playground.4geeks.com/todo/users/' + selectedUser)
				.then(resp => {
					console.log(resp)
					//manejamos errores, siempre se manejan
					if (!resp.ok) {
						//lanzamos un error si el OK es false (significa que hubo un error en el pedido)
						throw new Error(`${resp.status} ${resp.statusText}`)
					}
					return resp.json() //aqui transformamos la respuesta de texto a objeto js
				})
				.then(data => setSelectedUserTodos(data.todos))
				.catch(error => console.log('error recibido --//--> ', error))
		}
	}, [selectedUser]) //cada vez que se seleccione un usuario, se va a ejecutar este useEffect


	const handleUserCreation = (e) => {
		e.preventDefault();
		//fetch tipo POST
		fetch('https://playground.4geeks.com/todo/users/' + newUser, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
			//la api no pide en ESTE endpoint un body
		})
			.then(resp => {
				console.log(resp)
				//manejamos errores, siempre se manejan
				if (!resp.ok) {
					//lanzamos un error si el OK es false (significa que hubo un error en el pedido)
					throw new Error(`${resp.status} ${resp.statusText}`)
				}
				return resp.json() //aqui transformamos la respuesta de texto a objeto js
			})
			.then(data => console.log('fetch para newUser ---> ', data))
			.catch(error => console.log('error recibido --//--> ', error))
	}


	// const obj = {
	// 	name: 'pepe',
	// 	age: 55
	// }

	// console.log('obj puro', obj)
	// const stringObject = JSON.stringify(obj) /// trasnformamos el objeta a string
	// //console.log(typeof JSON.stringify(obj))
	// console.log('obj en string', stringObject)

	// const parsedObject = JSON.parse(stringObject)// pasamos el objeto de string a objeto js de nuevo
	// console.log('json.parse obj satring', parsedObject)



	const handleNewTodo = e => {
		e.preventDefault()
		if (!selectedUser) return alert('need to select a user first')
		//fetch tipo POST con body
		fetch('https://playground.4geeks.com/todo/todos/' + selectedUser, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"label": newTask,
				"is_done": false
			})
		})
			.then(resp => resp.json)
			.then(data => console.log(data))
			.catch(error => console.log(error))
	}

	return (
		<>
			<div className="text-center">


				<p className="fs-5">listado de usuario existentes en la api</p>
				{/* el ? es para "si users tiene informacion, mapea, sino no hagas nada" */}
				{users?.map(el =>
					<div
						className="container card my-3"
						key={el.id}
						onClick={() => setSelectedUser(el.name)}
					><p>user: <span>{el.name}</span></p></div>)}
			</div>

			<div className="card container">
				<p className="fs-5">creacion de usuario</p>
				<p>
					si no te gusta ningun usuario, o te cansaste de leer lo que ponen otros estudiantes, crea el tuyo
				</p>

				<form onSubmit={handleUserCreation}>
					<input type="text"
						value={newUser}
						onChange={e => setNewUser(e.target.value)}
					/>
					<input className="btn btn-primary" type="submit" />
				</form>

			</div>


			<p className="fs-5">Selected: {selectedUser} </p>
			<p>cuando selecciones un usuario, se cargaran sus todos</p>
			<p className="fs-5">
				todos de usuario seleccionado:
			</p>
			{selectedUserTodos?.map(el => <div key={el.id} className="card bg-info">
				<p>{el.label}</p>
			</div>

			)}

			<form onSubmit={handleNewTodo}>
				<p className="fs-5">crea una nueva tarea</p>
				<input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} />
				<input type="submit" />
			</form>
		</>
	);
};

export default Home;