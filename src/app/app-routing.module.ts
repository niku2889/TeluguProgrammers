import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TestingComponent } from './testing/testing.component';

//const routes: Routes = [{ path: "", component: HomeComponent }];
const routes: Routes = [{ path: "", component: LoginComponent },
                      { path: "TestPageK", component: TestingComponent }];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
