pipeline {
    agent any

    environment {
        SSH_KEY    = credentials('DO_SSH_KEY_ID')       // Jenkins credential ID for private key
        DO_HOST    = credentials('DO_HOST')              // IP or domain of the server
        DO_USER    = credentials('DO_USER')              // SSH user
        REMOTE_DIR = '/www/wwwroot/snvn.deepseahost.com/reactjs'
        NODE_VERSION = '22.13.1'
        PORT = '3082'
    }

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Deploy to server after build?')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    def nodeHome = tool name: "node-${NODE_VERSION}", type: 'NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run ESLint') {
            steps {
                sh 'npm run lint || echo "ESLint completed with warnings"'
            }
        }

        stage('Build React App') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Archive Build') {
            steps {
                sh 'tar czf build.tar.gz -C build .'
            }
        }

        stage('Deploy to Server') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                script {
                    def remote = [
                        name: 'do-server',
                        host: "${DO_HOST}",
                        user: "${DO_USER}",
                        identityFile: "${SSH_KEY}",
                        allowAnyHosts: true
                    ]

                    // Kill running process and backup old build
                    sshCommand remote: remote, command: """
                        echo '🔪 Killing process on port ${PORT}...'
                        PID=\$(lsof -t -i:${PORT})
                        if [ -n "\$PID" ]; then
                            kill -9 \$PID && echo '✅ Process killed.'
                        else
                            echo '⚠️ No process running.'
                        fi

                        cd ${REMOTE_DIR}
                        echo '📦 Backing up old build...'
                        mv build build.bak || echo 'No previous build found.'
                    """

                    // Upload and extract build
                    sshPut remote: remote, from: 'build.tar.gz', into: "${REMOTE_DIR}/"

                    sshCommand remote: remote, command: """
                        cd ${REMOTE_DIR}
                        mkdir -p build
                        tar xzf build.tar.gz -C build
                        rm build.tar.gz
                        echo '✅ Build extracted.'
                    """

                    // Start the React app
                    sshCommand remote: remote, command: """
                        cd ${REMOTE_DIR}/build
                        echo '🚀 Starting app on port ${PORT}...'
                        nohup npx serve -s . -l ${PORT} > serve.log 2>&1 &
                        echo '✅ App started.'
                    """

                    // Rollback if build directory doesn't exist
                    sshCommand remote: remote, command: """
                        cd ${REMOTE_DIR}
                        if [ ! -d build ]; then
                            echo '❌ Deployment failed. Rolling back...'
                            mv build.bak build
                            echo '🔁 Rollback complete.'
                        else
                            echo '✅ Deployment successful.'
                        fi
                    """
                }
            }
        }
    }

    post {
        cleanup {
            sh 'rm -f build.tar.gz'
        }
    }
}
