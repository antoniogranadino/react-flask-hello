const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user:null
		},
		actions: {
			signup: async (email, password) => {
				// try{
					const response = await fetch(process.env.BACKEND_URL + "api/signup", {
						method: "POST",
						body: JSON.stringify({"email":email, "password":password}),
						headers: {
							"Content-Type":"application/json"
						}
					})
					if(response.ok){
						console.log("estoy en el if")
						return true
					}
					console.log('estoy fuera de el if')
					return false
				// }catch(error){
					
				// 	console.log("Error loading message from backend", error)
				// 	return false
				// }
			},
			login: async (email, password) => {
				try{
					const response = await fetch(process.env.BACKEND_URL + "api/login", {
						method: "POST",
						body: JSON.stringify({"email":email, "password":password}),
						headers: {
							"Content-Type":"application/json"
						}
					})
					if (response.status === 200) {
                        const data = await response.json(); 
                        sessionStorage.setItem("token", data.token)
						setStore({user: data.user})
						return true
                    }
					sessionStorage.removeItem("token")
					setStore({user: false})
					return false
				}catch(error){
					console.log("Failed to login. Verify your credentials")
					sessionStorage.removeItem("token")
					setStore({user: false})
					return false
				}
			},

			private: async () => {
				try{
					const response = await fetch(process.env.BACKEND_URL + "api/private", {
						method: "GET",
						headers: {
							"Authorization":"Bearer " + sessionStorage.getItem("token")
						}
					})
					if (response.status === 200) {
                        const data = await response.json(); 
						setStore({user: data.user})
						return data.user
                    }
					sessionStorage.removeItem("token")
					setStore({user: false})
					return false
				}catch(error){
					console.log("Failed to login. Verify your credentials")
					sessionStorage.removeItem("token")
					setStore({user: false})
					return false
				}
			},
		}
	};
};

export default getState;
