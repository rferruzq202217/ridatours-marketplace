const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔌 Intentando conectar a MySQL...\n');
  
  try {
    const connection = await mysql.createConnection({
      host: '136.144.243.109',
      port: 3306,
      user: 'ridatours_temp',
      password: 'ridatours25',
      database: 'wp_sbvhf'
    });
    
    console.log('✅ Conexión exitosa!\n');
    
    // Test query
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as total FROM wp_sbvhf_posts WHERE post_type = 'tour'"
    );
    
    console.log(`📊 Total tours en WordPress: ${rows[0].total}\n`);
    
    await connection.end();
    console.log('🔒 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verificar que el usuario tenga acceso remoto');
    console.log('   2. Revisar firewall del servidor');
    console.log('   3. Verificar credenciales');
  }
}

testConnection();
