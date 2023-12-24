import React, { useState } from "react";
import { Helmet } from 'react-helmet';

const TITLE = 'Admin';

const Admin = () => {
  const [theme, setTheme] = useState("Light");

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <main>
      <Helmet>
        <title> {TITLE} </title>
      </Helmet>

      <nav>
        <ul>
          <li><a href="/admin">Anasayfa</a></li>
          <li><a href="/admin/users">Kullanıcılar</a></li>
          <li><a href="/admin/settings">Ayarlar</a></li>
        </ul>
      </nav>

      <section>
        <h2>Kullanıcı Listesi</h2>
        <ul>
          <li>Kullanıcı 1</li>
          <li>Kullanıcı 2</li>
          <li>Kullanıcı 3</li>
        </ul>
      </section>

      <section>
        <h2>Ayarlar</h2>
        <label>Tema Seçimi:</label>
        <select value={theme} onChange={handleThemeChange}>
          <option value="Light">Temiz Tema</option>
          <option value="Dark">Koyu Tema</option>
        </select>
      </section>

      <section>
        <h2>Günlük İstatistikler</h2>
        {/* Grafik veya istatistiklerinizi buraya ekleyin */}
      </section>

      <section>
        <h2>Yetkilendirme Ayarları</h2>
        {/* Yetkilendirme kontrollerini buraya ekleyin */}
      </section>
    </main>
  );
}

export default Admin;
	