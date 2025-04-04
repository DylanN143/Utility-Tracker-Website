import java.io.*;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;
import com.google.gson.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import jakarta.servlet.*;
import javax.sql.rowset.CachedRowSet;

class POST
{
    public static final int ADD_USER = 1;
}

class GET
{

}

@WebServlet("/Backend")
public class Backend extends HttpServlet
{
    // will prompt for password in console
    SQL sql = new SQL("jdbc:mysql://localhost:3306/cs160project", "root", "PASSHERE");

    /** ALL REQUESTS/SEND SHOULD BE IN JSON **/

    /**
     * <p>
     *     Gets data from the database<br>
     * @param request From the frontend, ONLY READ ONCE
     * @param response To the frontend
     * */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
    }

    /**
     * <p>
     *     Sends data to the database<br>
     * @param request From the frontend
     * @param response To the frontend, ONLY READ ONCE
     * */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSON jsonParser = new JSON(request);
        int id = jsonParser.getNumber("reqID").intValue();

        System.out.println(id);

        // add new user to database
        if (id == POST.ADD_USER)
        {
            String username = jsonParser.getString("username");
            String password = jsonParser.getString("password");
            String email = jsonParser.getString("email");

            String addUserQuery =
            """
            INSERT INTO User (Username, Password, Email)
            VALUES ('%s', '%s', '%s')
            """.formatted(username, password, email);

            sql.executeUpdate(addUserQuery);

            System.out.println("Success");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}