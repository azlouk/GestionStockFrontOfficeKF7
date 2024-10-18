import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JsonPipe} from "@angular/common";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {getToken, getUserDecodeID} from "../../../main";
import {RoleEnum, User} from "../../models/user";
import {Page} from "../../models/Page";
import {Produit} from "../../models/produit";


@Injectable({
  providedIn: 'root'
})
export class UserService {

    users: User[] = [];
    private api =environment.apiUrl;
    private filteredUsers: User[] = [];
    public permission: any ;


    constructor(private http : HttpClient, private router : Router) {
        if(getToken()!==undefined && getToken()!=="404")
            this.getUsers().subscribe(users => {
                this.users = users;
                this.filteredUsers = users;
            });

    }

    LoadUsers(page: number, size: number): Observable<Page<User>> {
        const url = `${this.api}/user/DtoReadPage?page=${page}&size=${size}`;
        const token = getToken();

        if (token) {
            const headers = new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json; charset=utf-8');

            return this.http.get<Page<User>>(url, {headers});
        } else {
            return new Observable();
        }
    }

// public loadGenarate() :void{
//
//
//
//         this.secretKey=this.generateUUID()
//         this.confirmationService.confirm({
//             header: 'Remember your Secret key?',
//             message: ` ${this.secretKey}`,
//             accept: () => {

//                 this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted your secret Key', life: 3000 });
//             },
//             reject: () => {
//                 this.secretKey="";
//                 this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });

//
//             }
//         });
//
//     }





    public generateUUID(): string {

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);



        });
    }
    addUser(newUser: any): Observable<any> {
        // this.users.push(newUser);

        const table=this.getTableWithRole(newUser) ;
        const token = getToken();
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.post<any>(this.api+'/'+table+'/create',newUser,{headers});
        }else {
            return  new Observable<any>() ;
        }
    }
    getUsers(): Observable<User[]> {
        const token = getToken();
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            return this.http.get<User[]>(`${this.api+'/user'}/read`,{headers});
        }else {
            return  new Observable<User[]>() ;
        }
    }
    getUsersClient(): Observable<User[]> {
        const token = getToken();

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<User[]>(`${this.api+'/client'}/read`,{headers});
        }else {
            return  new Observable<User[]>() ;
        }
    }
    getUsersResponsable(): Observable<User[]> {
        const token = getToken();

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<User[]>(`${this.api+'/responsable'}/read`,{headers});
        }else {
            return  new Observable<User[]>() ;
        }
    }
    getUsersTransporteur(): Observable<User[]> {
        const token = getToken();

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<User[]>(`${this.api+'/transporteur'}/read`,{headers});
        }else {
            return  new Observable<User[]>() ;
        }
    }
    getUsersProviders(): Observable<User[]> {
        const token = getToken();


        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<User[]>(`${this.api+'/provider'}/read`,{headers});
        }else {
            return  new Observable<User[]>() ;
        }
    }

    getUserById(id: number): Observable<User> {
        const url = `${this.api}/user/getUserById/${id}`; // Corrected URL path
        const token = getToken();


        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<User>(url, { headers });
        } else {
            return new Observable<User>();
        }
    }
    getPassword(id: number): Observable<any> {
        const token = getToken();


        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<any>(this.api+"/password/getpassword/"+id, { headers });
        } else {
            return new Observable<string>();
        }
    }
    searchUsers(term: string): void {
        term = term.toLowerCase();
        this.filteredUsers = this.users.filter(user =>
            user.firstname.toLowerCase().includes(term) ||
            user.lastname.toLowerCase().includes(term) ||
            user.adresse.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.telephone.toString().includes(term)
        );
    }

    getFilteredUsers(): User[] {
        return this.filteredUsers;
    }


    modifierUser(user: User ): Observable<User> {
        let table = this.getTableWithRole(user);

        const url = `${this.api}/${table}/update`;

        const token = getToken(); // Ensure you have a function to get the token
        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json; charset=utf8');
            const pass=user.passwordConfirm==undefined || user.passwordConfirm =='' ?user.pwed:user.passwordConfirm;
            const datauser :any={
                "id": user.id,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "email": user.email,
                "secretKey":user.secretKey,
                "telephone": user.telephone,
                "adresse": user.adresse,
                "role": user.role,
                "permission":user.permission,
                "password": pass,
            }







            return this.http.put<User>(url, datauser, { headers });
        } else {
            // Handle the case when the token is not available
            return new Observable<User>();
        }
    }

    deleteUser(userId: User): Observable<any> {
        const token = getToken();

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            const table = this.getTableWithRole(userId);
            const url = this.api + '/' + table + '/delete/' + userId.id;
            return this.http.delete(url, {headers}); // Indiquer que la réponse est une chaîne de texte
        }
        else  { return  new Observable<any>()}

    }
    getUsersByRole(role: RoleEnum): User[] {
        const data=role.toLowerCase()=='fournisseur'?'provider':role ;
        return this.users.filter((user) => user.role.toLowerCase() === data.toLowerCase()  );
    }



    getTableWithRole(newUser :any): string {
        switch (newUser.role.toLowerCase()) {
            case 'admin': {
                return 'admin' ;

                break
            }
            case 'manager': {
                return 'manager' ;


                break
            }
            case 'responsable' :{

                return 'responsable' ;
                break ;
            }
            case  'client' :{

                return 'client' ;
                break
            }
            case 'employer' :{

                return 'employer' ;
                break ;
            }
            case 'transporteur' :{

                return 'transporteur' ;
                break ;
            }
            case  'provider' : {

                return 'provider' ;
                break ;
            }
            default : return 'user' ;
        }
    }

    returnBack() {
        Swal.fire({
            title: 'Vous êtes sûr?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                this.router.navigate(['/users']);
                ;
            } else {
                // Handle the case where the user cancels the return
                Swal.fire({
                    title: 'Annulation',
                    icon: 'info',
                    text: 'Le retour a été annulé.'
                });
            }
        });
    }


    getUsersPassword(id:number): Observable<User> {
        const token = getToken();


        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<User>(this.api+'/password/getpassword/'+id,{headers});
        }else {
            return  new Observable<User>() ;
        }
    }


    exist(tableName: string) {
        const token = getToken(); // Assuming getToken() fetches the JWT token

        if (token) {
            // Set Authorization and Content-Type headers
            const headers = new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
                .set("Content-Type", "application/json; charset=utf8");

            // Prepare the data payload with the decoded user ID and table name
            const data: any = {
                "user": {
                    "id": getUserDecodeID().id // Assuming getUserDecodeID() extracts user ID from the token
                },
                "tableName": tableName
            };

            // Perform POST request to check permission
            this.http.post<boolean>(`${environment.apiUrl}/permission/checkpermission`, data, { headers })
                .subscribe(value => {
                    this.permission = value; // Update permission status based on response
                }, error => {
                    console.error('Error checking permission', error); // Handle errors
                    this.permission = false; // Set permission to false on error
                });

        } else {
            this.permission = false; // No token, so no permission
        }
    }


    // getEncodedPassword(pass: string): Observable<string> {
    //   return this.http.post<string>(`${this.api+'/user'}/encodePass`, { password: pass });
    // }


    getUserByEmail(email: string): Observable<User> {
        const token = getToken(); // Assuming getToken() returns the stored JWT token

        // Set the Authorization header with the Bearer token
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set("Content-Type", "application/json; charset=utf8");

        const url = `${this.api}/user/email/${email}`;

        // Pass the headers in the HTTP GET request
        return this.http.get<User>(url, { headers });
    }




}

