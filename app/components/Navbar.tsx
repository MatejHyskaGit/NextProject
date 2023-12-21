import { Menubar } from 'primereact/menubar';
import { InputSwitch } from 'primereact/inputswitch';
import { PrimeReactContext } from 'primereact/api';
import { useContext, useState } from 'react';

export default function Navbar() {
    const { changeTheme } = useContext(PrimeReactContext);
    const [checked, setChecked] = useState(true);

    const Theme = (theme: boolean) => {
        if (theme) {
          setChecked(theme)
          changeTheme?.('lara-light-blue', 'lara-dark-blue', 'app-theme', () => {console.log('dark')})
        }
        else {
          setChecked(theme)
          changeTheme?.('lara-dark-blue', 'lara-light-blue', 'app-theme', () => {console.log('light')})
        }
      };

    const start = (
        <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>
      );
    
      const end = (
        <div className="flex justify-content-center align-items-center">
          <i className="pi pi-sun mx-2"></i>
            <InputSwitch checked={checked} onChange={(e) => Theme(e.value)} />
          <i className="pi pi-moon mx-2"></i>
        </div>
      );
    
      return <Menubar start={start} end={end} />;
}