<?php
require_once 'config/inic.php';

        if(isset($_SESSION['id_usuario'])){
            header('location: Dashboard.php');
            exit();
        }

    $error = '';
    $usuario_ingresado = '';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){

        $usuario_ingresado = trim($_POST['usuario'] ?? '');
        $contrasena = $_POST['password'] ?? '';

        if(empty($usuario_ingresado) || empty($contrasena)){
            $error = 'por favor, complete todos los campos';
        } else{

            try{
                $conn = conexion::getConnection();

                $sql= "SELECT   
                id_usuario,
                nombre_usuario,
                contrasena_hash,
                nombre_completo,
                rol_sistema,
                status
                FROM usuarios
                WHERE nombre_usuario = :usuario
                LIMIT 1";

                $stmt = $conn->prepare($sql);
                $stmt->execute([':usuario' => $usuario_ingresado]);
                $user = $stmt->fetch();

                if($user){

                    if(!$user['status']){
                        $error = 'Su cuenta esta desactivada por pendejo carajo';
                    }else {
                        $hash_ingresado = hash('sha256', $contrasena);

                        if($hash_ingresado === $user['contrasena_hash']){

                        $_SESSION['id_usuario'] = $user['id_usuario'];
                        $_SESSION['nombre_usuario'] = $user['nombre_usuario'];
                        $_SESSION['nombre_completo'] = $user['nombre_completo'];
                        $_SESSION['rol'] = $user['rol_sistema'];
                        $_SESSION['fecha_login'] = date('y-m-d h:i:s');

                        $sql_update = "UPDATE usuarios
                                        set     ultimo_acceso = CURRENT_TIMESTAMP
                                        WHERE id_usuario = :id";
                        $conn->prepare($sql_update)->execute([':id' => $user['id_usuario']]);

                        registrar_actividad('Inicio de sesión', 'usuarios', $user['id_usuario']);

                        header('location: Dashboard.php');
                        exit();

                        } else{
                            $error = 'Usuario o contraseña incorrectos';
                        }
                    }
                } else {
                    $error = 'Usuario o contraseña incorrectos';
                }

            }catch(PDOException $e) {
                error_log("Error en login:" . $e->getMessage());
                $error = 'Error del sistema. Intente mas tarde.';
            }
        }
    }

?>





<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ONCOPATH - Iniciar Sesión</title>
    <link rel="stylesheet" href="css/login.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>

    <div class="box">

        <!-- Encabezado -->
        <div class="login-principal">
            <h1>ONCOPATH</h1>
            <p>Por favor Inicie Sesion para continuar</p>
        </div>

        <form id="formLogin" method="POST" action="">
            <?php if(!empty($error)):
            ?>
            <div class="login_verificacion error" style="display:block;">
                    <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>


        <input type="text"
                id="usuario"
                name="usuario"
                placeholder="Usuario"
                value="<?php echo htmlspecialchars($usuario_ingresado); ?>"
                required
        >

        <input 
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                required
        >

    <button type="submit">Iniciar Sesión</button>
    <div id="mensajeLogin" style="display:none; margin-top: 10px;"></div>

            </form>

    </div>

    <div>
       <footer class="login_Emblema">
    <img src="css/IMG/image1.png" alt="Logo Oncopath">
    <p>Derechos de autor © 2026 Servicio Oncológico del Estado Lara</p>
</footer>
    </div>

                    <script src="/JS/login.js"></script>
                    <script src="/JS/Sesion.JS"></script>

</body>
</html>