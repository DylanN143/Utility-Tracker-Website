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
    public static final int USER_USAGE_INFO = 2;
}

class GET
{
    public static final int GET_USER = 1;
}

@WebServlet("/Backend")
public class Backend extends HttpServlet
{
    private SQL sql = null;
    private boolean operationSuccess = false;
    private JSON successJSON = null;

    @Override
    public void init() throws ServletException
    {
        try
        {
            sql = new SQL("jdbc:mysql://localhost:3306/cs160project", "root", "YOURPASS");
        }
        catch (Exception e)
        {
            sql = null;
            System.out.println(e);
        }
    }

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
        successJSON = new JSON();

        if (sql == null)
        {
            successJSON.getJSON().addProperty("success", false);
            printJSONResponse(response, successJSON);
            return;
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        int id = Integer.parseInt(request.getParameter("reqID"));

        // gets the password based on inputted username
        // http://localhost:8080/Backend/Backend?reqID=1&username=${username}&password=${password}
        if (id == GET.GET_USER)
        {
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            String getPasswordQuery =
            """
            SELECT password FROM user U WHERE BINARY U.username = '%s';
            """.formatted(username);

            try (CachedRowSet result = sql.executeQuery(getPasswordQuery))
            {
                // CachedRowSet starts before the first row
                if (result.next())
                {
                    String databasePass = result.getString("password");

                    if (databasePass.equals(password)) // password matches
                    {
                        operationSuccess = true;
                    }
                    else // password doesn't match
                    {
                        operationSuccess = false;
                    }
                }
                else // user not found
                {
                    operationSuccess = false;
                }
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }

        successJSON.getJSON().addProperty("success", operationSuccess);
        printJSONResponse(response, successJSON);
    }

    /**
     * <p>
     *     Sends data to the database<br>
     * @param request From the frontend
     * @param response To the frontend, ONLY READ ONCE
     * */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        successJSON = new JSON();

        if (sql == null)
        {
            successJSON.getJSON().addProperty("success", false);
            printJSONResponse(response, successJSON);
            return;
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSON jsonParser = new JSON();
        jsonParser.parseRequestBody(request);
        int id = jsonParser.getNumber("reqID").intValue();

        // add new user to database
        if (id == POST.ADD_USER)
        {
            String username = jsonParser.getString("username");
            String password = jsonParser.getString("password");
            String email = jsonParser.getString("email");

            // mySQL database already checks for unique username and email
            try
            {
                String addUserQuery =
                """
                INSERT INTO User (Username, Password, Email)
                VALUES ('%s', '%s', '%s');
                """.formatted(username, password, email);
                sql.executeUpdate(addUserQuery);

                operationSuccess = true;
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // posts user's usage data to the database
        else if (id == POST.USER_USAGE_INFO)
        {
            double water = jsonParser.getNumber("waterUsage").doubleValue();
            double electricity = jsonParser.getNumber("electricityUsage").doubleValue();
            double gas = jsonParser.getNumber("gasUsage").doubleValue();
            String username = jsonParser.getString("username");
            int userID = -999;

            // make sure user exists
            String getUserQuery =
            """
            SELECT UserID FROM user U WHERE BINARY U.username = '%s';
            """.formatted(username);

            try (CachedRowSet result = sql.executeQuery(getUserQuery))
            {
                if (result.next())
                {
                    userID = result.getInt("UserID");
                }
                else
                {
                    operationSuccess = false;
                    throw new SQLException();
                }
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }

            try
            {
                String addWaterUsage =
                """
                INSERT INTO WaterUsage (UserID, Gallons)
                VALUES (%s, %s);
                """.formatted(userID, water);
                sql.executeUpdate(addWaterUsage);

                String addElectricityUsage =
                """
                INSERT INTO ElectricityUsage (UserID, KilowattHour)
                VALUES (%s, %s);
                """.formatted(userID, electricity);
                sql.executeUpdate(addElectricityUsage);

                String addGasUsage =
                """
                INSERT INTO GasUsage (UserID, CubicFeet)
                VALUES (%s, %s);
                """.formatted(userID, gas);
                sql.executeUpdate(addGasUsage);

                operationSuccess = true;
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }

        successJSON.getJSON().addProperty("success", operationSuccess);
        printJSONResponse(response, successJSON);
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

    void printJSONResponse(HttpServletResponse response, JSON json) throws IOException
    {
        PrintWriter res = response.getWriter();
        res.print(json.getJSON().toString());
        res.flush();
    }
}