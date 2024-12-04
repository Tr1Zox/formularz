import React, { useState } from 'react';
import axios from 'axios';
import dom from 'react-dom/client';


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    birthDate: '',
    country: '',
    gender: '',
    marketingAgreement: false,
    termsOfServiceAgreement: false
  });
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Funkcja do pobierania krajów z API
  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  // Funkcja walidacji formularza
  const validateForm = () => {
    const newErrors = {};
    
    // Walidacja wymaganych pól
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = 'Imię musi zawierać co najmniej 2 znaki';
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = 'Nazwisko musi zawierać co najmniej 2 znaki';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Podaj poprawny adres email';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie zgadzają się';
    }
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 99) {
      newErrors.age = 'Wiek musi być liczbą z przedziału 18-99';
    }
    if (formData.birthDate && formData.age && Number(formData.age) + 1970 - new Date(formData.birthDate).getFullYear() > Number(formData.age)) {
      newErrors.birthDate = 'Data urodzenia nie zgadza się z wiekiem';
    }
    if (formData.country.length === 0) {
      newErrors.country = 'Wybierz kraj';
    }
    if (!formData.termsOfServiceAgreement) {
      newErrors.termsOfServiceAgreement = 'Zgoda na regulamin jest wymagana';
    }

    setErrors(newErrors);
    
    // Jeśli nie ma błędów, formularz jest poprawny
    return Object.keys(newErrors).length === 0;
  };

  // Funkcja obsługi submitu formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isValid = validateForm();
    if (isValid) {
      try {
        await axios.post('https://your-api-endpoint.com/register', formData);
        alert('Rejestracja udana! Dane zostały wysłane do konsoli.');
        console.log(JSON.stringify(formData));
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Wystąpił problem podczas rejestracji. Spróbuj ponownie.');
      }
    }
    setLoading(false);
  };

  // Funkcje obsługi zmiany danych w polach formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  // Inicjalizacja krajów
  React.useEffect(fetchCountries, []);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">Imię:</label>
        <input 
          type="text" 
          id="firstName" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange}
          required
        />
        {errors.firstName && <span style={{ color: 'red' }}>{errors.firstName}</span>}
      </div>

      <div>
        <label htmlFor="lastName">Nazwisko:</label>
        <input 
          type="text" 
          id="lastName" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange}
          required
        />
        {errors.lastName && <span style={{ color: 'red' }}>{errors.lastName}</span>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          required
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password">Hasło:</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange}
          required
        />
        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Potwierdź hasło:</label>
        <input 
          type="password" 
          id="confirmPassword" 
          name="confirmPassword" 
          value={formData.confirmPassword} 
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
      </div>

      <div>
        <label htmlFor="age">Wiek:</label>
        <input 
          type="number" 
          id="age" 
          name="age" 
          value={formData.age} 
          onChange={handleChange}
          min="18"
          max="99"
          required
        />
        {errors.age && <span style={{ color: 'red' }}>{errors.age}</span>}
      </div>

      <div>
        <label htmlFor="birthDate">Data urodzenia:</label>
        <input 
          type="date" 
          id="birthDate" 
          name="birthDate" 
          value={formData.birthDate} 
          onChange={handleChange}
          required
        />
        {errors.birthDate && <span style={{ color: 'red' }}>{errors.birthDate}</span>}
      </div>

      <div>
        <label htmlFor="country">Kraj:</label>
        <select 
          id="country" 
          name="country" 
          value={formData.country} 
          onChange={handleChange}
          required
        >
          <option value="">Wybierz kraj</option>
          {countries.map(country => (
            <option key={country.cca2} value={country.cca2}>
              {country.name.common} <img src={country.flags.png} alt={country.name.common} style={{ width: '20px', height: 'auto' }} />
            </option>
          ))}
        </select>
        {errors.country && <span style={{ color: 'red' }}>{errors.country}</span>}
      </div>

      <div>
        <label htmlFor="gender">Płeć:</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Wybierz płeć</option>
          <option value="male">Mężczyzna</option>
          <option value="female">Kobieta</option>
        </select>
      </div>

      <div>
        <label htmlFor="marketingAgreement">
          <input 
            type="checkbox" 
            id="marketingAgreement" 
            name="marketingAgreement" 
            checked={formData.marketingAgreement} 
            onChange={(e) => setFormData(prevData => ({ ...prevData, marketingAgreement: e.target.checked }))}
          /> Zgoda na marketingowe wiadomości
        </label>
      </div>

      <div>
        <label htmlFor="termsOfServiceAgreement">
          <input 
            type="checkbox" 
            id="termsOfServiceAgreement" 
            name="termsOfServiceAgreement" 
            checked={formData.termsOfServiceAgreement} 
            onChange={(e) => setFormData(prevData => ({ ...prevData, termsOfServiceAgreement: e.target.checked }))}
          /> Zgoda na regulamin
        </label>
        {errors.termsOfServiceAgreement && <span style={{ color: 'red' }}>{errors.termsOfServiceAgreement}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Rejestruj się...' : 'Zarejestruj się'}
      </button>
    </form>
  );
};

const root = dom.createRoot(document.getElementById("root"));
root.render(<><RegistrationForm/></>)
