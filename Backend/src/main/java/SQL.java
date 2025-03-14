import javax.sql.rowset.*;
import java.io.*;
import java.sql.*;
import java.util.*;
import com.mysql.cj.jdbc.result.CachedResultSetMetaData;
import org.json.*;

class SQL
{
    public static Connection connection = null;

    public SQL(String url, String username, String password) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.out.println(e);
        }

        if (connection == null) {
            try {
                connection = DriverManager.getConnection(url, username, password);
            } catch (SQLException e) {
                System.out.println(e);
            }
        } else {
            System.out.println("Connection already exists!");
        }
    }
}