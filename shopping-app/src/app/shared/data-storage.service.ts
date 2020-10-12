import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators'
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor( private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService){}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://shopping-app-64c9e.firebaseio.com/recipes.json', recipes)
        .subscribe(res => {
            console.log(res)
        })
    }

    // fetchRecipes(){
    //     this.http.get<Recipe[]>('https://shopping-app-64c9e.firebaseio.com/recipes.json')
    //     .subscribe(recipes => {
    //         //console.log(recipes)
    //         this.recipeService.setRecipes(recipes)
    //     })
    // }

    // fetchRecipes(){
    //     //take will automatically unsubscribe after getting 1 value in this case
    //     //exhaustmap combines two observables the user and the http
    //    return this.authService.user.pipe(take(1), exhaustMap( user => {
    //         return this.http.get<Recipe[]>('https://shopping-app-64c9e.firebaseio.com/recipes.json',
    //         {
    //             params: new HttpParams().set('auth', user.token)
    //         })
    //     }),
    //     map(recipes => {
    //         return recipes.map(recipe => {
    //             return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []} 
    //         })
    //     }),
    //     tap(recipes => {
    //         this.recipeService.setRecipes(recipes)

    //     }))
    // }

    fetchRecipes(){
        return this.http.get<Recipe[]>('https://shopping-app-64c9e.firebaseio.com/recipes.json'
        ).pipe(
          map(recipes => {
            return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []} 
            })
        }),
        tap(recipes => {
            this.recipeService.setRecipes(recipes)
        })
        )
    }
}