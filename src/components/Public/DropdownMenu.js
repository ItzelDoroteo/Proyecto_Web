import React, { useState, useEffect, useRef } from 'react';
import '../../styles/DropdownMenu.css'; // Archivo de estilos para el menú
import { MdExpandMore, MdExpandLess, MdCategory } from 'react-icons/md';
import { Link } from 'react-router-dom';

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Hacer la solicitud a la API para obtener las categorías
    fetch('http://localhost:5000/products/categories/getAll')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <a onClick={toggleMenu}>
        Categoría {isOpen ? <MdExpandLess size={25} className="icon-align" /> : <MdExpandMore size={25} className="icon-align" />}
      </a>
      <ul className={`dropdown-list ${isOpen ? 'show' : ''}`}>
        {categories.map(category => (
          <Link key={category.categoriaId} to={`/category/${category.categoriaId}`}>
            <li>{category.categoria}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default DropdownMenu;
