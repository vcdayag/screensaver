#version 300 es
in vec3 a_position;
// in float a_point_size;
// uniform mat4 u_transformation_matrix;
uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;
uniform mat3 u_normal_matrix;
uniform vec3 light_position;
uniform vec3 u_light_diffuse;

in vec3 a_normal;

in vec4 a_color; //attribute vec4 a_color;
out vec4 v_color; //varying vec4 v_color;

void main() {
    //Apply the transformations to the object to be rendered
    // gl_Position = u_projection_matrix * u_transformation_matrix * u_view_matrix * u_model_matrix * a_position;
    gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vec4(a_position,1.0);

    vec3 newPos = vec3(gl_Position);
    vec3 u_light_direction = light_position - newPos;
    
    vec4 normalFace = u_view_matrix * u_model_matrix * vec4(a_normal,1.0);


    vec3 corrected_a_normal = vec3(u_normal_matrix * vec3(normalFace));
    vec3 normalized_a_normal = normalize(corrected_a_normal);
    vec3 normalized_u_light_direction = normalize(u_light_direction);
    float lambert_coefficient = dot(-normalized_u_light_direction, normalized_a_normal);
    lambert_coefficient = max(lambert_coefficient, 0.0);
    vec3 diffuse_color =  vec3( vec4(u_light_diffuse,1) * a_color * lambert_coefficient);
    v_color = vec4(diffuse_color,1.0);
   
    
}