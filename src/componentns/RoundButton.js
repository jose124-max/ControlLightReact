import React, { useState } from 'react';
import './RoundButton.css'; // Archivo de estilos

const RoundButton = ({ isChecked, onClick  }) => {

    document.addEventListener("DOMContentLoaded",function(){
        let s = this.getElementsByName("switch");
        if (s.length)
          s[0].addEventListener("change",function(){
            this.removeAttribute("class");
          });
      });
    return (
        <>
        <div className='container_ligth' style={{ width: '100%' }}>
            
            <label>
                <input 
                    className="pristine" 
                    type="checkbox" 
                    name="switch" 
                    checked={isChecked} 
                    readOnly 
                    onClick={onClick} 
                />
            </label>
        </div>
        </>

    );
};

export default RoundButton;
