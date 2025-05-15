# aws-lakeformation-mcp

## Testing with mcp-inspector
```
 npx @modelcontextprotocol/inspector ts-node src/index.ts
 ```

## Building and Running the Docker Image

To build the Docker image for the AWS Lake Formation MCP server, use the following command:

```bash
docker build -t mcp/aws-lakeformation-mcp .
```

This command will create a Docker image tagged as `mcp/aws-lakeformation-mcp`.

To run the Docker container, use the following command:

```bash
docker run -i --rm mcp/aws-lakeformation-mcp
```

This will start the MCP server in a Docker container and remove the container once it stops.

## Deploying the MCP Server in VS Code

To deploy the MCP server in Visual Studio Code, add the following configuration to your `settings.json` file:

```json
"mcp": {
    "servers": {
        "aws-lakeformation-mcp": {
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "mcp/aws-lakeformation-mcp"
            ],
            "env": {
                "AWS_ACCESS_KEY_ID": "${input:aws_access_key}",
                "AWS_SECRET_ACCESS_KEY": "${input:aws_secret_key}",
                "AWS_REGION": "${input:aws_region}"
            }
        }
    }
}
```

This configuration specifies the command and environment variables required to run the MCP server in a Docker container. Replace the placeholders in the `env` section with your AWS credentials and region.

## License
This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.