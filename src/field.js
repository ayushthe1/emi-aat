import React, { useState } from 'react';

const ElectricFieldCalculator = () => {
  const [pointCharges, setPointCharges] = useState([]);
  const [pointP, setPointP] = useState({ x: 0, y: 0, z: 0 });
  const [electricField, setElectricField] = useState({netField:0});
  const [electricPotential, setelectricPotential] = useState(0)
  const [surfaceCharge, setsurfaceCharge] = useState([]);

  const handleSurfaceCharge = (e) => {
    e.preventDefault();

    const chargeDensity = parseFloat(document.getElementById('chargeDensity').value);
    const xcoef = parseFloat(document.getElementById('xcoef').value);
    const ycoef = parseFloat(document.getElementById('ycoef').value);
    const zcoef = parseFloat(document.getElementById('zcoef').value);

    setsurfaceCharge([...surfaceCharge, {chargeDensity, xcoef, ycoef, zcoef}])

  }

  const handleAddCharge = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    const charge = parseFloat(document.getElementById('charge').value);
    const x = parseFloat(document.getElementById('x').value);
    const y = parseFloat(document.getElementById('y').value);
    const z = parseFloat(document.getElementById('z').value);
  
    if (isNaN(charge) || isNaN(x) || isNaN(y) || isNaN(z)) {
      alert('Please enter valid numbers for the charge and coordinates.');
      return;
    }
  
    setPointCharges([...pointCharges, { charge, x, y, z }]);
  };
  

  const handleSetPointP = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    const x = parseFloat(document.getElementById('px').value);
    const y = parseFloat(document.getElementById('py').value);
    const z = parseFloat(document.getElementById('pz').value);
  
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      alert('Please enter valid numbers for the coordinates of Point P.');
      return;
    }
  
    setPointP({ x, y, z });
  };



  const calculateElectricField = () => {
    // Implement your electric field calculation logic here...
    const k = 9*Math.pow(10,9)

    // Example calculation
    let totalField=0.00
    let totalPotential=0.00
    let xdir=0
    let ydir=0
    let zdir=0
    pointCharges.forEach((charge) => {
      // ... (calculation using Coulomb's Law)
        let distanceSq = Math.pow(charge.x - pointP.x,2) + Math.pow(charge.y - pointP.y,2) + Math.pow(charge.z - pointP.z,2)
        let field = (k*charge.charge)/distanceSq
        // totalField+=field
        xdir += field*charge.x
        ydir += field*charge.y
        zdir += field*charge.z


      let potential = (k*charge.charge)/Math.sqrt(distanceSq)
      totalPotential+= potential
    
    });
    

    let permitivity = 8.85 *Math.pow(10, -12)
    surfaceCharge.forEach((surface) => {
      let xcoef = surface.xcoef
      let ycoef = surface.ycoef
      let zcoef = surface.zcoef
      let chargeDensity = surface.chargeDensity
      let n_mag = Math.pow(xcoef, 2)+Math.pow(ycoef,2)+Math.pow(zcoef, 2)
      n_mag = Math.sqrt(n_mag)

      let field = chargeDensity/(2*permitivity*n_mag)
      
      xdir += field*xcoef
      ydir += field*ycoef
      zdir += field*zcoef 
      totalPotential += 2*3.14*k*chargeDensity   
    })

    

    totalField += Math.pow(xdir,2) + Math.pow(ydir,2) + Math.pow(zdir, 2)
    totalField = Math.sqrt(totalField, 2)

    setelectricPotential(totalPotential)
  
    setElectricField((prevElectricField) => ({
        ...prevElectricField,
        netField: totalField,
      }));
  };

  // Render functions for point charges and point P with error handling
  const renderPointCharges = () => {
    return pointCharges.map((charge) => (
      <li key={charge.x + '' + charge.y + '' + charge.z}>
        Charge: {charge.charge} C, Location: ({charge.x}, {charge.y}, {charge.z})
      </li>
    ));
  };

  const renderSurfaceCharges = () => {
    return surfaceCharge.map((surface) => (
      <li key={surface.x + '' + surface.y + '' + surface.z + Math.random()}>
        Surface Charge Density: {surface.chargeDensity} C/m2, Equation: ({surface.xcoef}, {surface.ycoef}, {surface.zcoef})
      </li>
    ));
  };
  

  const renderPointP = () => {
    return (
      <p>Point P: ({pointP.x}, {pointP.y}, {pointP.z})</p>
    );
  };

  return (
    <div>
      <h2>Electric Field and Potential Calculator</h2>
      <h3>Point Charges</h3>
      <ul>{renderPointCharges()}</ul>
      <form onSubmit={(e) => e.preventDefault()}>
  <label htmlFor="charge">Charge (C):</label>
  <input type="number" id="charge" required />
  <br />
  <label htmlFor="x">X Coordinate:</label>
  <input type="number" id="x" required />
  <br />
  <label htmlFor="y">Y Coordinate:</label>
  <input type="number" id="y" required />
  <br />
  <label htmlFor="z">Z Coordinate:</label>
  <input type="number" id="z" required />
  <br />
  <button type="submit" onClick={handleAddCharge}>
    Add Charge
  </button>
</form>

<h3>Surface Charges</h3>
      <ul>{renderSurfaceCharges()}</ul>
<form onSubmit={(e) => e.preventDefault()}>
  <label htmlFor="charge">Charge Density :</label>
  <input type="number" id="chargeDensity" required />
  <br />
  <label htmlFor="x">X Coef:</label>
  <input type="number" id="xcoef" required />
  <br />
  <label htmlFor="y">Y Coef:</label>
  <input type="number" id="ycoef" required />
  <br />
  <label htmlFor="z">Z Coef:</label>
  <input type="number" id="zcoef" required />
  <br />
  <button type="submit" onClick={handleSurfaceCharge}>
    Add Surface Charge
  </button>
</form>



      <h3>Point P</h3>
      {renderPointP()}
      <form onSubmit={(e) => e.preventDefault()}>
  <label htmlFor="px">X Coordinate:</label>
  <input type="number" id="px" required />
  <br />
  <label htmlFor="py">Y Coordinate:</label>
  <input type="number" id="py" required />
  <br />
  <label htmlFor="pz">Z Coordinate:</label>
  <input type="number" id="pz" required />
  <br />
  <button type="submit" onClick={handleSetPointP}>
    Set Point P
  </button>
</form>

      <h3>Electric Field at Point P</h3>
      <p>
        {console.log('Hi')}
        {console.log(electricField)}
        {/* X: {electricField.x}, Y: {electricField.y}, Z: {electricField.z} N/C */}
        E = {electricField.netField} V/m
      </p>
      <h3>Electric Potential at Point P</h3>
      <p>
        V = {electricPotential} Volts
      </p>
      <button type="button" onClick={calculateElectricField}>
        Calculate Field
      </button>
    </div>
  );
};

export default ElectricFieldCalculator;
