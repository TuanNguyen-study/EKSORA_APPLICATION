import logo from './logo.svg';
import './App.css';
import React from'react';
import AppHeader from './Component/AppHeader';
import PageContent from './Component/PageContent';
import AppFooter from './Component/AppFooter';
import SideMenu from './Component/SideMenu';
function App() {
  return (
    <div className="App">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu></SideMenu>
        <PageContent></PageContent>
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
